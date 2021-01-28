import 'source-map-support/register'

import * as uuid from 'uuid'

import { DiaryItemsAccess } from '../dataLayer/DiaryItemsAccess'
import { DiaryItemsStorage } from '../dataLayer/DiaryItemsStorage'
import { DiaryItem } from '../models/DiaryItem'
import { DiaryItemUpdate } from '../models/DiaryItemUpdate'
import { CreateDiaryItemRequest } from '../requests/CreateDiaryItemRequest'
import { UpdateDiaryItemRequest } from '../requests/UpdateDiaryItemRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('diaryItems')

const diaryItemsAccess = new DiaryItemsAccess()
const diaryItemsStorage = new DiaryItemsStorage()

export async function getDiaryItems(userId: string): Promise<DiaryItem[]> {
  logger.info(`Retrieving all diary items for user ${userId}`, { userId })

  return await diaryItemsAccess.getdiaryItems(userId)
}

export async function createDiaryItem(userId: string, createDiaryItemRequest: CreateDiaryItemRequest): Promise<DiaryItem> {
    const diaryItemId = uuid.v4()
  
    const newItem: DiaryItem = {
      userId,
      diaryItemId,
      createdAt: new Date().toISOString(),
      attachmentUrl: null,
      ...createDiaryItemRequest
    }
  
    logger.info(`Creating diary item ${diaryItemId} for user ${userId}`, { userId, diaryItemId, DiaryItem: newItem })
  
    await diaryItemsAccess.createDiaryItem(newItem)
  
    return newItem
  }

  export async function deleteDiaryItem(userId: string, diaryItemId: string) {
    logger.info(`Deleting diary item ${diaryItemId} for user ${userId}`, { userId, diaryItemId })
  
    const item = await diaryItemsAccess.getDiaryItem(diaryItemId)
  
    if (!item)
      throw new Error('Not Found')
  
    if (item.userId !== userId) {
      logger.error(`User ${userId} does not have permission to delete diary item ${diaryItemId}`)
      throw new Error('Forbidden')
    }
  
    diaryItemsAccess.deleteDiaryItem(diaryItemId)
  }

  export async function updateDiaryItem(userId: string, diaryItemId: string, updateDiaryItemRequest: UpdateDiaryItemRequest) {
    logger.info(`Updating diary item ${diaryItemId} for user ${userId}`, { userId, diaryItemId, diaryItemUpdate: updateDiaryItemRequest })
  
    const item = await diaryItemsAccess.getDiaryItem(diaryItemId)
  
    if (!item)
      throw new Error('Not Found')
  
    if (item.userId !== userId) {
      logger.error(`User ${userId} does not have permission to update diary item ${diaryItemId}`)
      throw new Error('Forbidden')
    }
  
    diaryItemsAccess.updateDiaryItem(diaryItemId, updateDiaryItemRequest as DiaryItemUpdate)
  }

  export async function updateAttachmentUrl(userId: string, diaryItemId: string, attachmentId: string) {
    logger.info(`Generating attachment URL for attachment ${attachmentId}`)
  
    const attachmentUrl = await diaryItemsStorage.getAttachmentUrl(attachmentId)
  
    logger.info(`Updating diary item ${diaryItemId} with attachment URL ${attachmentUrl}`, { userId, diaryItemId })
  
    const item = await diaryItemsAccess.getDiaryItem(diaryItemId)
  
    if (!item)
      throw new Error('Not Found')
  
    if (item.userId !== userId) {
      logger.error(`User ${userId} does not have permission to update diary item ${diaryItemId}`)
      throw new Error('Forbidden')
    }
  
    await diaryItemsAccess.updateAttachmentUrl(diaryItemId, attachmentUrl)
  }
  
  export async function generateUploadUrl(attachmentId: string): Promise<string> {
    logger.info(`Generating upload URL for attachment ${attachmentId}`)
  
    const uploadUrl = await diaryItemsStorage.getUploadUrl(attachmentId)
  
    return uploadUrl
  }