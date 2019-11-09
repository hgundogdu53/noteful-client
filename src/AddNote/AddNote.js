import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import ValidationError from '../ValidationError'
import config from '../config'
import './AddNote.css'



export default class AddNote extends Component {
  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  constructor(props) {
    super(props)
    this.state = {
      folderId: '',
      name: '',
      noteValid: false,
      noteFolderValid: false,
      formValid: false,
      validMessage: '',
      valid2Message: ''
    }
  }

  updateNoteName(name) {
    this.setState({ name }, () => { this.validateNote(name) });
  };
  updateNoteFolderId(folderId) {
    this.setState({ folderId }, () => { this.validateNoteFolder(folderId) });
  }
  validateNote(inputValue) {
    let errorMsg = this.state.validMessage;
    let hasError = false;

    inputValue = inputValue.trim();
    if (inputValue.length === 0) {
      errorMsg = 'Note Name is required';
      hasError = true;

    } else if (inputValue.length < 3) {
      errorMsg = 'Note Name must be at least 3 characters';
      hasError = true;

    } else {
      errorMsg = '';
      hasError = false;
    }

    this.setState({
      validMessage: errorMsg,
      noteValid: !hasError
    })

  }
  validateNoteFolder(inputValue) {
    let errorMsg = this.state.valid2Message;
    let hasError = false;

    inputValue = inputValue.trim();
    if (inputValue === ' ') {
      errorMsg = 'Please select a folder';
      hasError = true;

    } else {
      errorMsg = '';
      hasError = false;
    }

    this.setState({
      valid2Message: errorMsg,
      noteFolderValid: !hasError
    })

  }

  formValid() {
    this.setState({
      formValid: this.state.noteValid && this.state.noteFolderValid
    });
  }

  static contextType = ApiContext;

  handleSubmit = e => {
    e.preventDefault()
    const newNote = {
      name: e.target['note-name'].value,
      content: e.target['note-content'].value,
      folderId: e.target['note-folder-id'].value,
      modified: new Date(),
    }
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newNote),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(note => {
        this.context.addNote(note)
        this.props.history.push(`/folder/${newNote.folderId}`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    const { folders = [] } = this.context
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>
            <input type='text' id='note-name-input' name='note-name' onChange={e => this.updateNoteName(e.target.value)} />
            <ValidationError hasError={!this.state.noteValid} message={this.state.validMessage} />
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            <textarea id='note-content-input' name='note-content' />
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select id='note-folder-select' name='note-folder-id' onChange={e => this.updateNoteFolderId(e.target.value)}>
              <option value={null}>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
            <ValidationError hasError={!this.state.noteFolderValid} message={this.state.valid2Message} />
          </div>
          <div className='buttons'>
            <button type='submit' disabled={this.state.formValid}>
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
} 