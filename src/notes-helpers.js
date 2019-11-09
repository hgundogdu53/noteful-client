export const findFolder = (folders = [], folderId) =>
  folders.find(folder => folder.id === folderId)

export const findNote = (notes = [], noteId) =>
  notes.find(note => note.id === Number(noteId))

export const getNotesForFolder = (notes = [], folderId) => (
  (!folderId)
    ? notes
    : notes.filter(note => note.folderId === Number(folderId))
)

export const countNotesForFolder = (notes = [], folderId) => {
  // console.log(notes.length, folderId)
  return notes.filter(note => note.folderId === folderId).length
}