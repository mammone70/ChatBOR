/**
 * Business Logic Use Cases for Files
 */

import { deleteTranscript, storeFile } from "@/dao/documents";


export async function uploadFileUseCase(file : File){
    await storeFile(file);        
}

export async function deleteFileUseCase(fileId : string) {
    //TODO Add logic once files associated with user/group/role
    
    //delete DB record
    return await deleteTranscript(fileId);
}
