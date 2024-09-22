/**
 * Business Logic Use Cases for Files
 */

import { deleteTranscript } from "@/dao/transcripts";

export async function deleteFileUseCase(
    fileId : string,
) {
    //TODO Add logic once files associated with user/group/role
    
    //delete DB record
    return await deleteTranscript(fileId);
}