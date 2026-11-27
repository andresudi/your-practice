/** A restored backup can remove the ID currently open in the composer. Keep that draft. */
export function upsertNote(notes,note){return notes.some(n=>n.id===note.id)?notes.map(n=>n.id===note.id?note:n):[note,...notes];}
