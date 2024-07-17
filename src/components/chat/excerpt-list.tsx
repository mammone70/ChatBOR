"use client"

import { ScrollArea } from '../ui/scroll-area';
import { ExcerptProps } from '@/components/chat/transcript-excerpts';
import ExcerptListItem from './excerpt-list-item';

interface ExcerptListProps {
    excerpts: ExcerptProps[] | null,
    setSelected(id : string) : void,
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