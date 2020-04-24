import { firestore, firebase } from '../utils/firebase';

const logRef = firestore.collection('logs');

const log = async (log) => {
  try {
    await logRef.add(log);
  } catch (error) {
  }
};

export default log;