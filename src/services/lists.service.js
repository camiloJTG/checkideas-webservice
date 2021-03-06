import {
  create,
  getById,
  getByParams,
  update,
  remove,
} from '../libraries/database/mongo';
import { deleteMany } from './items.service';

const COLLECTION = 'lists';
const COLLECTION_REF = 'users';

export const createList = async (data) => {
  const { userId } = data;

  // Validate if userId is valid
  const userExists = await getById(COLLECTION_REF, userId);
  if (Object.keys(userExists).length === 0) {
    return {
      info: `The user id ${userId} was not foun in the database`,
      status: 404,
    };
  }

  // Generate list object
  const newUser = {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // Saved new list
  const result = await create(COLLECTION, newUser);
  return { info: result, status: 201 };
};

export const getAllListsByUserId = async (userId) => {
  // Validate if userId is valid
  const userExists = await getById(COLLECTION_REF, userId);
  if (Object.keys(userExists).length === 0) {
    return {
      info: `The user id ${userId} was not foun in the database`,
      status: 404,
    };
  }

  // Get all lists by user id
  const result = await getByParams(COLLECTION, { userId });
  if (result.length === 0) {
    return { info: result, status: 404 };
  }
  return { info: result, status: 200 };
};

export const getOneListByUserId = async (data) => {
  const { userId, listId } = data;
  // Validate if userId is valid
  const userExists = await getById(COLLECTION_REF, userId);
  if (Object.keys(userExists).length === 0) {
    return {
      info: `The user id ${userId} was not found in the database`,
      status: 404,
    };
  }

  // Validate if list id is valid
  const listExists = await getById(COLLECTION, listId);
  if (Object.keys(listExists).length === 0) {
    return {
      info: `The list id ${listId} was not found in the database`,
      status: 404,
    };
  }
  return { info: listExists, status: 200 };
};

export const updateLlist = async (id, data) => {
  const { name, userId } = data;

  // Validate if list id is valid
  const listExists = await getById(COLLECTION, id);
  if (Object.keys(listExists).length === 0) {
    return {
      info: `The list id ${id} was not found in the database`,
      status: 404,
    };
  }
  // Validate if user id is valid
  const userIdExists = await getByParams(COLLECTION, { userId });
  if (Object.keys(userIdExists).length === 0) {
    return {
      info: `The user id ${userId} was not found in the database`,
      status: 404,
    };
  }

  const listIdAndUserIdIsAgree = await getByParams(COLLECTION, { id, userId });
  if (listIdAndUserIdIsAgree.length === 0) {
    return {
      info: `The user id ${userId} and the list id ${id} are not within the same collection`,
      status: 404,
    };
  }
  if (!name && !userId) {
    return { info: 'There is no data to change', status: 228 };
  }

  // Update list
  const result = await update(COLLECTION, data, id);
  return { info: result, status: 201 };
};

export const deleteList = async (id) => {
  // Validate if list id is valid
  const listExists = await getById(COLLECTION, id);
  if (Object.keys(listExists).length === 0) {
    return {
      info: `The list id ${id} was not found in the database`,
      status: 404,
    };
  }

  // Delete items with list id
  await deleteMany(id);
  const result = await remove(COLLECTION, id);
  return { info: result, status: 200 };
};
