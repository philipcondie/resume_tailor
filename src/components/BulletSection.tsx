import { ReactNode } from "react";
import { EditableInline, EditableTextArea } from "./EditableFields";

type BulletItem = {
    id: string,
    bullets: string[]
}

type BulletSectionProps<T extends BulletItem> = {
    items: T[],
    renderHeader: (item:T, updateItemField: (key: keyof T, value: string) => void) => ReactNode,
    onItemsChange: (items:T[]) => void,
}
export function BulletSection<T extends BulletItem>({items,renderHeader,onItemsChange}:BulletSectionProps<T>) {
    const updateBullet = (id:string, bulletIndex:number, content:string) => {
        onItemsChange(items.map(item => (
            item.id === id 
            ? {...item, bullets: item.bullets.map((b,i) => i === bulletIndex ? content : b )} 
            : item
        )));
    };

    const addBullet = (id:string) => {
        onItemsChange(items.map(item => (
            item.id === id
            ? {...item, bullets: [...item.bullets, '']}
            : item
        )));
    };

    const deleteBullet = (id:string, bulletIndex:number) => {
        onItemsChange(items.map(item =>(
            item.id === id
            ? {...item, bullets: item.bullets.filter((_,i) => i !== bulletIndex )}
            : item
        )));
    }
    
    return (
        items.map((item:T)=> {
            const updateItemField = (key: keyof T, value: string) => {
                onItemsChange(items.map(i => i.id === item.id ? {...i, [key]: value} : i));
            };
            return (
            <div className="section-item" key={item.id}>
                {renderHeader(item, updateItemField)}
                <ul className="section-item-bullets">
                    {item.bullets.map((bullet,i) => (
                        <li key={i} className="bullet-row">
                            <EditableTextArea className='editable' content={bullet} handleChange={(text) => updateBullet(item.id, i, text)}/>
                            <button className='bullet-controls' onClick={() => deleteBullet(item.id, i)}>×</button>
                        </li>
                    ))}
                </ul>
                <button className='add-bullet-controls' onClick={() => addBullet(item.id)}>+</button>
            </div>
        )})
    )
}