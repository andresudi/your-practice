// English messages from domain/app code mapped to translation keys; shown through translateMessage().
export const messageKeys={
 "This backup uses an unsupported version. Your current progress is unchanged.":"msg.unsupportedVersion",
 "The backup contains invalid lesson progress.":"msg.invalidLessonProgress",
 "Notes must contain valid text, dates, and types (maximum 20,000 characters each).":"msg.invalidNotes",
 "The backup contains invalid review attempts.":"msg.invalidAttempts",
 "The backup contains an invalid rehearsal sequence.":"msg.invalidSequence",
 "Backups must be smaller than 5 MiB.":"msg.backupTooLarge",
 "This file is not a valid JSON backup.":"msg.invalidJson",
 "Browser storage is unavailable. Keep a downloaded backup of your work.":"msg.storageUnavailableKeepBackup",
 "Storage is full.":"msg.storageFull",
 // saveState() builds this one from a template (src/domain/state.js), with or without "Storage is full.".
 "Could not save in this browser. Your changes are kept in this open tab; download a backup.":"msg.couldNotSave",
 "Could not save in this browser. Your changes are kept in this open tab; download a backup. Storage is full.":"msg.couldNotSaveFull",
 "Browser storage is unavailable.":"msg.storageUnavailable",
 "Your existing storage is damaged. Export recovery data, then restore a valid backup to replace it.":"msg.storageDamaged",
 "Browser storage is unavailable. Export your work before closing this tab.":"msg.storageUnavailableExport",
 "Saved on this browser":"msg.savedOnBrowser",
 "Cannot restore because browser storage is unavailable.":"msg.restoreUnavailable",
 "Choose a backup smaller than 5 MiB.":"msg.chooseSmallerBackup",
 "Backup checked.":"msg.backupChecked",
 "Could not read the backup. Your progress is unchanged.":"msg.couldNotRead",
 "Progress restored.":"msg.progressRestored",
};
export function translateMessage(message,translate){const key=typeof message==='string'&&messageKeys[message.trim()];return key?translate(key):message;}
