import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ValidationError from './ValidationError';
import ApiContext from '../ApiContext'
import config from '../config'
import './AddFolder.css'

export default class AddFolder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      folderValid: false,
      validMessage: ''
    }
  }
  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  static contextType = ApiContext;

  validateFolder(inputValue) {
    let errorMsg = this.state.validMessage;
    let hasError = false;

    inputValue = inputValue.trim();
    if (inputValue.length === 0) {
      errorMsg = 'Folder Name is required';
      hasError = true;

    } else if (inputValue.length < 3) {
      errorMsg = 'Folder Name must be at least 3 characters';
      hasError = true;

    } else {
      errorMsg = '';
      hasError = false;
    }

    this.setState({
      validMessage: errorMsg,
      folderValid: !hasError
    })

  }

  handleSubmit = e => {
    e.preventDefault()
    const folder = {
      name: e.target['folder-name'].value
    }
    fetch(`${config.API_ENDPOINT}/api/folders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(folder),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(folder => {
        this.context.addFolder(folder)
        this.props.history.push(`/folder/${folder.id}`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>

        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
            </label>
            <input type='text' id='folder-name-input' name='folder-name' />
          </div>
          <ValidationError hasError={!this.state.folderValid} message={this.state.validMessage} />

          <div className='buttons'>
            <button type='submit'>
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}
