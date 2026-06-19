import { useSortable } from "@dnd-kit/react/sortable";
import { EditableTextArea } from "../utils/EditableFields";
import { Bullet } from "../../types/resume";

type BulletProps = {
    bullet: Bullet,
    index: number,
    updateBullet: (text:string) => void,
    deleteBullet: () => void,
}

export function BulletComponent({bullet, index, updateBullet, deleteBullet}:BulletProps) {
    const { ref, handleRef } = useSortable({id:bullet.id, index}) 
    return (
        <li ref={ref} className="bullet-row">
            <EditableTextArea className='editable' content={bullet.text} handleChange={(text) => updateBullet(text)}/>
            <button className='bullet-controls bullet-delete' onClick={deleteBullet}>×</button>
            <button ref={handleRef} className="bullet-controls drag-handle">⠿</button>
        </li>
    )
}
