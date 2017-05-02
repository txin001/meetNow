import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchSingleGroupEvents, attendEvent, leave } from '../../actions/event_actions';
import { eventsArray } from '../../reducers/event_reducer';
import { Router, withRouter } from 'react-router';
import Modal from 'react-modal';
import CreateEventForm from '../forms/create_event_form';

class EventsIndex extends React.Component {
  constructor() {
    super();
    this.state = { modalType: ''};
    this.closeModal = this.closeModal.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
  }

  closeModal() {
    this.setState({ modalType: false});
  }

  handleModalOpen(form) {
    return () => {
      this.closeModal();
      this.setState({ modalType: form });
    };
  }

  componentDidMount() {
    this.props.fetchSingleGroupEvents(this.props.params.groupId);
  }

  render() {
    if (Object.keys(this.props.events).length > 0) {
      const eventArray = Object.keys(this.props.events).map(id  => this.props.events[id]);
      return (
        <div className='event-index-box'>
            {
              eventArray.map(event => (
              <ul className='events-box-on-group' key={event.id}>
                <div className='event-time'>{event.time.slice(0, 10)}</div>
                <Link className='event-title' to={`groups/${this.props.params.groupId}/events/${event.id}`}>{event.name}</Link>


                <div className='rsvp-flex'>
                  <div className='attendee-box'>
                      {Object.keys(event.attendees).map(id => event.attendees[id]).map(attendee => (
                            <img key={attendee.id} className='attendee-pic' src={attendee.image} />
                    ))}
                  </div>

                  <div className='event-going-box'>
                    { this.props.isMember && <Link className='rsvp-button' to={`groups/${this.props.params.groupId}/events/${event.id}`}>RSVP</Link> }
                    { !this.props.isMember && <button onClick={this.props.handleJoinGroup} className="join-group-button">Join us!</button> }
                    <div className='count-going'>{Object.keys(event.attendees).length} going</div>
                  </div>
                </div>

                  <div className='location-description'>
                    <li className='event-location'><i className="fa fa-map-marker fa-1x map-close-marker"></i>{event.location}</li>
                    <li className='event-description'>{event.description}</li>
                  </div>
              </ul>
            ))}
        </div>
      );
    } else {
      return (
        <div className='no-events-box'>
          <div className='display-no-events'>No Upcoming Events</div>
          <button onClick={this.handleModalOpen('event')} className='create-event'>Create an Event</button>

            <Modal
              overlayClassName='modal-overlay'
              className='modal-container large-modal'
              isOpen={this.state.modalType === "event"}
              onRequestClose={this.closeModal}
              contentLabel="event-modal">
              <CreateEventForm closeModal={this.closeModal} handleModalOpen={this.handleModalOpen("event")}/>
            </Modal>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  events: state.events,
  loading: state.loading.loading
});

const mapDispatchToProps = dispatch => ({
  fetchSingleGroupEvents: id => dispatch(fetchSingleGroupEvents(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EventsIndex));
