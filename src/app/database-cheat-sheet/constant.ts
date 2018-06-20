export const terminology =
    {
        sql: ['database', 'table', 'row', 'column', 'table joins', 'primary key', 'index'],
        rethink: ['database', 'table', 'document', 'field', 'table joins', '	primary key (by default id)', 'index'],
        mongodb: ['database', 'collection', 'document or BSON document', 'field', 'lookup aggregate (embedded documents and linking)', 'primary key (by default _id)', 'index'],
    }
export const terminologyNames = ['sql', 'rethink', 'mongodb']
export function getTerminology(keys: string[]) {
    Object.keys(terminology).forEach(key => {
        if (keys.includes(key)) {
            console.log('ok')
        }
    })
}