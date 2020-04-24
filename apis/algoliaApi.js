import Constants from 'expo-constants';
import algoliasearch from 'algoliasearch';

const algoliaClient = algoliasearch(Constants.manifest.extra.algolia.appId, Constants.manifest.extra.algolia.apiKey);
const algoliaIndex = algoliaClient.initIndex('address');
import log from "./logApi";

const saveAddressIndexInAlgolia = async (ticketId, address) => {
  try {
    return algoliaIndex.saveObject({objectID: ticketId, address: address});
  } catch (error) {
    await log({msg: 'saveAddressIndexInAlgolia', error})
  }
}

const searchAddressIndexFromAlgolia = async (text) => {
  try {
    return algoliaIndex.search(text);
  } catch (error) {
    await log({msg: 'searchAddressIndexFromAlgolia', text})
  }
}

const deleteAlgoliaObject = async (objectID) => {
  try {
    return algoliaIndex.deleteObject(objectID);
  } catch (error) {
    await log({msg: 'deleteObject algolia', objectID});
  }
}

export {saveAddressIndexInAlgolia, searchAddressIndexFromAlgolia, deleteAlgoliaObject};
