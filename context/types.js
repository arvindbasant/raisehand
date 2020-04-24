export const SET_REFRESHING = 'SET_REFRESHING';
export const SET_FETCHING = 'SET_FETCHING';
export const SET_HELP_TICKETS = 'ADD_HELP_TICKETS';
export const UPDATE_HELP_TICKET = 'UPDATE_HELP_TICKET';
export const SET_SERVICE_TICKETS = 'GET_SERVICE_TICKETS';
export const UPDATE_SERVICE_TICKET = 'UPDATE_SERVICE_TICKET';
export const UPDATE_SEARCH_TICKET = 'UPDATE_SEARCH_TICKET';
export const SET_TICKET = 'SET_TICKET';
export const SET_SEARCH_TICKETS = 'SET_SEARCH_TICKETS';
export const SET_SEARCHING = 'SET_SEARCHING';
export const SET_PROFILE = 'SET_PROFILE';
export const SET_USER = 'SET_USER';
export const SET_TAB_INDEX = 'SET_TAB_INDEX';
export const CLEAR_STATE = 'CLEAR_STATE';

export const TICKET_STATUS = {
  ACTIVE: 'active',
  SHORTLISTED: 'shortlisted',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DECLINED: 'declined',
  SERVICE_CANCELLED: 'service_cancelled',
  SHORTLISTED_REMOVED: 'shortlisted_removed'
};

export class Ticket {
  constructor(adults = 1,
              cancelledDate = '',
              children = 0,
              completedDate = '',
              createdDate = '',
              errorMessage = '',
              items = [],
              location = new Location(),
              mobile = '',
              name = '',
              processStartDate = '',
              serviceUserId = '',
              status = '',
              userId = '') {
    this.adults = adults;
    this.cancelledDate = cancelledDate;
    this.children = children;
    this.completedDate = completedDate;
    this.createdDate = createdDate;
    this.errorMessage = errorMessage;
    this.items = items;
    this.location = location;
    this.mobile = mobile;
    this.name = name;
    this.processStartDate = processStartDate;
    this.serviceUserId = serviceUserId;
    this.status = status;
    this.userId = userId;
  }
}

export class Location {
  constructor(enteredLocation = '', fetchedLocation = {location: '', error: ''}) {
    this.enteredLocation = enteredLocation;
    this.fetchedLocation = fetchedLocation;
  }

}

export class Profile {
  constructor(fullName = '', mobile = '', address = '', location = new Location(), isServiceUser = false) {
    this.fullName = fullName;
    this.mobile = mobile;
    this.location = new Location();
    this.isServiceUser = isServiceUser;
  }
}

export class User {
  constructor(fullName = '', email = '', emailVerified = false, mobile = '', address = '', photoURL = '', location = new Location(), isServiceUser = false) {
    this.fullName = fullName;
    this.email = email;
    this.emailVerified = emailVerified;
    this.mobile = mobile;
    this.photoURL = photoURL;
    this.location = new Location();
    this.isServiceUser = isServiceUser;
  }
}

export const DEFAULT_APPLICATION_STATE = {
  refreshing: false,
  fetching: false,
  searching: false,
  helpTickets: [],
  serviceTickets: [],
  searchTickets: [],
  ticket: new Ticket(),
  helpScreenIndex: 1,
  profile: new Profile(),
  tabIndex: 0,
  user: new User(),
};