import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { updateDiaryItem } from '../../businessLogic/diaryItems'
import { UpdateDiaryItemRequest } from '../../requests/UpdateDiaryItemRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('updateDiaryItem')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing updateDiaryItem event', { event })

  const userId = getUserId(event)
  const dairyItemId = event.pathParameters.dairyItemId
  const updatedDiaryItem: UpdateDiaryItemRequest = JSON.parse(event.body)

  try {
    await updateDiaryItem(userId, dairyItemId, updatedDiaryItem)
  } catch (e) {
    if (e.message == 'Not Found') {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: e.message
        })
      }
    } else if (e.message == 'Forbidden'){
      return {
        statusCode: 403,
        body: JSON.stringify({
          message: e.message
        })
      }
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}
