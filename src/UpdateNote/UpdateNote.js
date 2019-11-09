import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import './UpdateNote.css';
import config from '../config';
import ApiContext from '../context';

export default class UpdateNote extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            content: '',
        }
    }

    static contextType = ApiContext;

    setName(name) {
        this.setState({ name })
    };

    setContent(content) {
        this.setState({ content });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const updatedNote = {
            name: this.state.name,
            content: this.state.content,
            folderId: this.props.folderId,
            modified: new Date(),
        };
        fetch(`${config.API_ENDPOINT}/notes/${this.props.note.id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(updatedNote),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.status);
                }
                else return res.json();
            })
            .then(note => {
                console.log('updated', note)
                this.context.updateNote(note[0])
                this.props.history.push('/')
            })
            .catch(error => console.error({ error }));
    };

    render() {
        return (
            <section className='UpdateNote'>
                <h2>Update a note</h2>
                <NotefulForm onSubmit={this.handleSubmit}>
                    <div className='field'>
                        <label htmlFor='note-name-input'>
                            Name
            </label>
                        <input type='text' id='note-name-input'
                            defaultValue={(this.props.note) ? this.props.note.name : ''}
                            onChange={(e) => this.setName(e.target.value)} />
                    </div>
                    <div className='field'>
                        <label htmlFor='note-content-input'>
                            Content
            </label>
                        <input type='text' id='note-content-input'
                            defaultValue={(this.props.note) ? this.props.note.content : ''}
                            onChange={(e) => this.setContent(e.target.value)} />
                    </div>
                    <div className='buttons'>
                        <button type='submit'>
                            Update note
            </button>
                    </div>
                </NotefulForm>
            </section>
        )
    }
}
