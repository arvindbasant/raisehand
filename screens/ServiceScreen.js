import React from 'react';
import TicketCardList from '../components/TicketCardList';
import TicketSearchBar from '../components/TicketSearchBar';
import Screens from "../constants/Screens";

const ServiceScreen = () => {
  return (
    <TicketCardList statusArr={['shortlisted', 'processing', 'completed']} screen={Screens.SERVICE} >
      <TicketSearchBar />
    </TicketCardList>
  )
};

ServiceScreen.navigationOptions = {
  header: null,
};

export default ServiceScreen;