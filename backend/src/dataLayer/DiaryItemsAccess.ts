import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { DiaryItem } from '../models/DiaryItem'
import { DiaryItemUpdate } from '../models/DiaryItemUpdate'
import { createLogger } from '../utils/logger'

const logger = createLogger('diaryItemsAccess')

const AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS)

export class DiaryItemsAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly diaryItemsTable = process.env.DIARY_ITEMS_TABLE,
    private readonly diaryByUserIndex = process.env.DIARY_USER_INDEX
  ) {}

async getdiaryItems(userId: string): Promise<DiaryItem[]> {
    logger.info(`Getting all diary items for user ${userId} from ${this.diaryItemsTable}`)

    const result = await this.docClient.query({
      TableName: this.diaryItemsTable,
      IndexName: this.diaryByUserIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    const items = result.Items

    logger.info(`Found ${items.length} diary items for user ${userId} in ${this.diaryItemsTable}`)

    return items as DiaryItem[]
  }

  async createDiaryItem(diaryItem: DiaryItem) {
    logger.info(`Putting diary item ${diaryItem.diaryItemId} into ${this.diaryItemsTable}`)

    await this.docClient.put({
      TableName: this.diaryItemsTable,
      Item: diaryItem,
    }).promise()
  }

  async getDiaryItem(diaryItemId: string): Promise<DiaryItem> {
    logger.info(`Getting diary item ${diaryItemId} from ${this.diaryItemsTable}`)

    const result = await this.docClient.get({
      TableName: this.diaryItemsTable,
      Key: {
        diaryItemId
      }
    }).promise()

    const item = result.Item

    return item as DiaryItem
  }

  async deleteDiaryItem(diaryItemId: string) {
    logger.info(`Deleting diary item ${diaryItemId} from ${this.diaryItemsTable}`)

    await this.docClient.delete({
      TableName: this.diaryItemsTable,
      Key: {
        diaryItemId
      }
    }).promise()    
  }

  async updateDiaryItem(diaryItemId: string, diaryItemUpdate: DiaryItemUpdate) {
    logger.info(`Updating diary item ${diaryItemId} in ${this.diaryItemsTable}`)

    await this.docClient.update({
      TableName: this.diaryItemsTable,
      Key: {
        diaryItemId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        "#name": "name"
      },
      ExpressionAttributeValues: {
        ":title": diaryItemUpdate.title,
        ":body": diaryItemUpdate.body
      }
    }).promise()   
  }

  async updateAttachmentUrl(diaryItemId: string, attachmentUrl: string) {
    logger.info(`Updating attachment URL for diary item ${diaryItemId} in ${this.diaryItemsTable}`)

    await this.docClient.update({
      TableName: this.diaryItemsTable,
      Key: {
        diaryItemId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
    }).promise()
  }

}
