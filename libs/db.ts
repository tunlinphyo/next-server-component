import { JsonDB, Config } from 'node-json-db'
import { GenericObject, Table } from './definations';

const db = new JsonDB(new Config("test_db", true, true, '/'));

type BaseData = {
    id: number;
    isDelete: boolean;
}

export async function GET<T extends GenericObject>(table: Table, query?: GenericObject) {
    await db.reload()
    const datas:T[] = await db.getData(`/${table}`)
    if (!query) return datas
    return datas.filter(item => {
        let is = true
        Object.entries(query).forEach(([key, value]) => {
            is = is && (item[key] == value)
        })
        return is
    })
}

export async function GET_ONE<T extends GenericObject>(table: Table, query: GenericObject) {
    await db.reload()
    const datas:T[] = await db.getData(`/${table}`)
    if (!datas) return undefined
    return datas.find(item => {
        let is = true
        Object.entries(query).forEach(([key, value]) => {
            is = is && (item[key] == value)
        })
        return is
    })
}

export async function POST<T extends BaseData>(table: Table, data: Partial<T>) {
    let datas:T[] = await db.getData(`/${table}`)
    const newData: Partial<T> = {
        ...data,
        id: Date.now(),
        createDate: new Date(),
        isDelete: false,
    }
    await db.push(`/${table}`, [ ...datas, newData ])
    return newData as T
}

export async function PUT<T extends BaseData>(table: Table, data: T) {
    let datas:T[] = await db.getData(`/${table}`)
    const newDatas = datas.map(item => item.id === data.id 
            ? { ...data, updateDate: new Date() } 
            : item
        )
    await db.push(`/${table}`, [ ...newDatas ])
    return data
}

export async function PATCH<T extends BaseData>(table: Table, data: Partial<T>) {
    let datas:T[] = await db.getData(`/${table}`)
    let newData: T | undefined
    const newDatas = datas.map(item => {
        if (item.id === data.id) {
            newData = {
                ...item,
                ...data,
                updateDate: new Date()
            }
            return newData
        }
        return item
    })
    await db.push(`/${table}`, [ ...newDatas ])
    return newData
}

export async function DELETE<T extends BaseData>(table: Table, id: number) {
    let datas:T[] = await db.getData(`/${table}`)
    const newDatas = datas.map(item => {
        if (item.id === id) return { ...item, isDelete: true }
        else return item
    })
    await db.push(`/${table}`, [ ...newDatas ])
    return id
}