import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import Logo from '../components/Logo';
import { sample } from 'lodash';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Logo />
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: wp('5%')
        }}>
          <Quote />
        </View>

        <View style={styles.about}>
          <Text style={styles.aboutText}><Text
            style={{ color: Colors.tintColor }}>raisehand!! </Text> is a platform to help people
            during difficult time such as pandemic like COVID-19. It uses location-based services to connect a help
            seeker with help provider. A person in need calls out for help by sharing his location using which essential
            services are delivered.</Text>
        </View>
        <View style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text
            style={{
              fontFamily: 'lora-italic',
              fontSize: wp('3.5%'),
              color: Colors.tintColor
            }}
          >Write us @ programdesignlab@gmail.com</Text>
        </View>
      </ScrollView>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};


const Quote = () => {
  const quotes = ['Don’t you know yet? It is your light that lights the worlds.', 'I know you’re tired but come, this is the way.'];
  return (
    <Text
      style={{
        color: Colors.tintColor,
        fontSize: wp('6%'),
        fontFamily: 'lora-italic'
      }}
    >
      {`"${sample(quotes)}"`}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: wp('10%'),

  },
  about: {
    alignItems: 'center',
  },
  aboutText: {
    fontSize: wp('4%'),
    color: Colors.textDark,
    fontFamily: 'lora-italic',
    textAlign: 'justify'

  }
});
