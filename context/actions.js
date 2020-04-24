import {
  SET_FETCHING,
  SET_HELP_TICKETS,
  UPDATE_HELP_TICKET,
  SET_SERVICE_TICKETS,
  UPDATE_SERVICE_TICKET,
  SET_REFRESHING,
  SET_TICKET,
  SET_SEARCH_TICKETS,
  SET_SEARCHING, UPDATE_SEARCH_TICKET,
  SET_PROFILE,
  SET_TAB_INDEX, CLEAR_STATE, SET_USER,
} from './types';

export const setRefreshing = (refreshing) => {
  return {type: SET_REFRESHING, refreshing};
};


export const setFetching = (fetching) => {
  return {type: SET_FETCHING, fetching};
};

export const setHelpTickets = (tickets) => {
  return {type: SET_HELP_TICKETS, tickets};
};

export const updateHelpTicket = (ticket) => {
  return {type: UPDATE_HELP_TICKET, ticket};
};

export const setServiceTickets = (tickets) => {
  return {type: SET_SERVICE_TICKETS, tickets};
};

export const updateServiceTicket = (ticket) => {
  return {type: UPDATE_SERVICE_TICKET, ticket};
};

export const updateSearchTicket = (ticket) => {
  return {type: UPDATE_SEARCH_TICKET, ticket};
};

export const setTicket = (form) => {
  return {type: SET_TICKET, form};
}

export const setProfile = (profile) => {
  return {type: SET_PROFILE, profile};
}
export const setUser = (user) => {
  return {type: SET_USER, user};
}

export const setSearchTickets = (tickets) => {
  return {type: SET_SEARCH_TICKETS, tickets};
};

export const setSearching = (searching) => {
  return {type: SET_SEARCHING, searching};
};

export const setTabIndex = (tabIndex) => {
  return {type: SET_TAB_INDEX, tabIndex};
}


export const clearState = () => {
  return {type: CLEAR_STATE};
}