import { ReactNode } from "react";
import { BulletComponent } from "./BulletComponent";
import { DragDropProvider, DragEndEvent } from "@dnd-kit/react";
import { move } from '@dnd-kit/helpers';
import { Bullet } from "../../types/resume";

type BulletSectionType = {
    id: string,
    bullets: Bullet[]
}

type BulletSectionProps<T extends BulletSectionType> = {
    items: T[],
    renderHeader: (item:T, updateItemField: (key: keyof T, value: string) => void) => ReactNode,
    onItemsChange: (items:T[]) => void,
}
export function BulletSection<T extends BulletSectionType>({items,renderHeader,onItemsChange}:BulletSectionProps<T>) {
    
    const updateBullet = (id:string, bulletId:string, content:string) => {
        onItemsChange(items.map(item => (
            item.id === id 
            ? {...item, bullets: item.bullets.map((b) => b.id === bulletId ? {...b, text:content} : b )} 
            : item
        )));
    };

    const addBullet = (id:string) => {
        onItemsChange(items.map(item => (
            item.id === id
            ? {...item, bullets: [...item.bullets, {id: crypto.randomUUID(), text: ''}]}
            : item
        )));
    };

    const deleteBullet = (id:string, bulletId:string) => {
        onItemsChange(items.map(item =>(
            item.id === id
            ? {...item, bullets: item.bullets.filter((b) => b.id !== bulletId )}
            : item
        )));
    };
    
    return (
        items.map((item:T)=> {
            const handleDragEnd = (event: DragEndEvent) => {
                const reordered = move(item.bullets, event);
                onItemsChange(items.map(i => 
                    i.id === item.id ? {...i, bullets: reordered} : i
                ));
            };
            const updateItemField = (key: keyof T, value: string) => {
                onItemsChange(items.map(i => i.id === item.id ? {...i, [key]: value} : i));
            };
            return (
            <div className="section-item" key={item.id}>
                {renderHeader(item, updateItemField)}
                <DragDropProvider onDragEnd={handleDragEnd}>
                <ul className="section-item-bullets">
                    {item.bullets.map((bullet,i) => (
                        <BulletComponent
                            key={bullet.id}
                            bullet={bullet} 
                            index={i} 
                            updateBullet={(text) => updateBullet(item.id, bullet.id, text)}
                            deleteBullet={() => deleteBullet(item.id,bullet.id)}
                        />
                    ))}
                </ul>
                </DragDropProvider>
                <button className='add-bullet-controls' onClick={() => addBullet(item.id)}>+</button>
            </div>
        )})
    )
}