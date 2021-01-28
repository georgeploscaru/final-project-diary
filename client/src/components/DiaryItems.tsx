import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  TextArea
} from 'semantic-ui-react'

import { createDiaryItem, deleteDiaryItem, getDiaryItems, patchDiaryItem } from '../api/diary-api'
import Auth from '../auth/Auth'
import { DiaryItem } from '../types/DiaryItems'

interface DiaryItemsProps {
  auth: Auth
  history: History
}

interface DiaryItemsState {
  diaryItems: DiaryItem[]
  newDiaryItemTitle: string,
  newDiaryItemBody: string,
  loadingDiaryItems: boolean
}

export class DiaryItems extends React.PureComponent<DiaryItemsProps, DiaryItemsState> {
  state: DiaryItemsState = {
    diaryItems: [],
    newDiaryItemTitle: '',
    newDiaryItemBody: '',
    loadingDiaryItems: true
  }

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDiaryItemTitle: event.target.value })
  }

  handleBodyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDiaryItemBody: event.target.value })
  }

  onEditButtonClick = (diaryItemId: string) => {
    this.props.history.push(`/diary-items/${diaryItemId}/edit`)
  }

  onDiaryItemCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newDiaryItem = await createDiaryItem(this.props.auth.getIdToken(), {
        title: this.state.newDiaryItemTitle,
        body: this.state.newDiaryItemBody
      })
      this.setState({
        diaryItems: [...this.state.diaryItems, newDiaryItem],
        newDiaryItemTitle: '',
        newDiaryItemBody: ''
      })
    } catch {
      alert('Diary item creation failed')
    }
  }

  onDiaryItemDelete = async (diaryItemId: string) => {
    try {
      await deleteDiaryItem(this.props.auth.getIdToken(), diaryItemId)
      this.setState({
        diaryItems: this.state.diaryItems.filter(diaryItem => diaryItem.diaryItemId !== diaryItemId)
      })
    } catch {
      alert('Diary item deletion failed')
    }
  }

  // onDiaryItemCheck = async (pos: number) => {
  //   try {
  //     const diaryItem = this.state.diaryItems[pos]
  //     await patchDiaryItem(this.props.auth.getIdToken(), diaryItem.diaryItemId, {
  //       title: diaryItem.title,
  //       body: diaryItem.body
  //     })
  //     this.setState({
  //       diaryItems: update(this.state.diaryItems, {
  //         [pos]: {  }
  //       })
  //     })
  //   } catch {
  //     alert('DiaryItem update failed')
  //   }
  // }

  async componentDidMount() {
    try {
      const diaryItems = await getDiaryItems(this.props.auth.getIdToken())
      this.setState({
        diaryItems,
        loadingDiaryItems: false
      })
    } catch (e) {
      alert(`Failed to fetch diary items: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Diary entries</Header>

        {this.renderCreateDiaryInput()}

        {this.renderDiaryItems()}
      </div>
    )
  }

  renderCreateDiaryInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            fluid
            placeholder="Diary title"
            onChange={this.handleTitleChange}
          />
          <Input type="textarea" fluid placeholder="Diary body" onChange={this.handleBodyChange} 
              action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Save entry',
              onClick: this.onDiaryItemCreate
            }}/>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderDiaryItems() {
    if (this.state.loadingDiaryItems) {
      return this.renderLoading()
    }

    return this.renderDiaryItemsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Diary Entries
        </Loader>
      </Grid.Row>
    )
  }

  renderDiaryItemsList() {
    return (
      <Grid padded>
        {this.state.diaryItems.map((diaryItem, pos) => {
          return (
            <Grid.Row key={diaryItem.diaryItemId}>
              <Grid.Column width={14} verticalAlign="middle">
                {diaryItem.title}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(diaryItem.diaryItemId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onDiaryItemDelete(diaryItem.diaryItemId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {diaryItem.attachmentUrl && (
                <Image src={diaryItem.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
