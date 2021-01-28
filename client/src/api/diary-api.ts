import { apiEndpoint } from '../config'
import { DiaryItem } from '../types/DiaryItems';
import { CreateDiaryItemRequest } from '../types/CreateDiaryItemRequest';
import Axios from 'axios'
import { UpdateDiaryItemRequest } from '../types/UpdateDiaryItemRequest';

export async function getDiaryItems(idToken: string): Promise<DiaryItem[]> {
  console.log('Fetching diary items')

  const response = await Axios.get(`${apiEndpoint}/diary-items`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Diary Items:', response.data)
  return response.data.items
}

export async function createDiaryItem(
  idToken: string,
  newDiaryItem: CreateDiaryItemRequest
): Promise<DiaryItem> {
  const response = await Axios.post(`${apiEndpoint}/diary-items`,  JSON.stringify(newDiaryItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchDiaryItem(
  idToken: string,
  diaryItemId: string,
  updatedDiaryItem: UpdateDiaryItemRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/diary-items/${diaryItemId}`, JSON.stringify(updatedDiaryItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteDiaryItem(
  idToken: string,
  diaryItemId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/diary-items/${diaryItemId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  diaryItemId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/diary-items/${diaryItemId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
