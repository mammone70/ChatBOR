"use client"

import { ExcerptProps } from '@/app/providers';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import ExcerptListItem from './excerpt-list-item';
import { Dispatch, SetStateAction } from 'react';

interface ExcerptListProps {
    excerpts: ExcerptProps[] | null,
    // setSelected(id : string) : void,
    setSelected : Dispatch<SetStateAction<string>> | null;
    selectedId : string | null,
}

function ExcerptList(excerptListProps : ExcerptListProps) {    
    return (
        <ScrollArea className="h-screen">
            <div className="flex flex-col gap-2 p-4 pt-0">
                {excerptListProps.excerpts!.map((excerpt) => (
                    <ExcerptListItem 
                        key={excerpt.chunkId}
                        excerpt={excerpt}
                        selectedId={excerptListProps.selectedId}
                        setSelected={excerptListProps.setSelected}
                    >
                    </ExcerptListItem>
                ))}
            </div>
        </ScrollArea>
    )
}

export default ExcerptList