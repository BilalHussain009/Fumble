import * as SQLite from 'expo-sqlite'
const db=SQLite.openDatabase('OAuth')
export const init=()=>{
    return new Promise((resolve,reject)=>{
        db.transaction((tx)=>{
            // tx.executeSql("DROP TABLE Auth;"),
            tx.executeSql("CREATE TABLE IF NOT EXISTS Auth1 (id INTEGER PRIMARY KEY NOT NULL,token TEXT NOT NULL,userId TEXT NOT NULL,image Text default 'default' );",
            [],
            ()=>{
                resolve()
            },
            (_,err)=>{
                reject(err)
            })
        })
    })
}
export const addImage=(image)=>{
    return new Promise((resolve,reject)=>{
        db.transaction((tx)=>{
            tx.executeSql(`UPDATE Auth1 SET image=? WHERE id=1` ,
            [image],
            ()=>{
                resolve()
            },
            (_,err)=>{
                reject(err)
            })
        })
    })
}
export const addToken=(token,userId)=>{
    return new Promise((resolve,reject)=>{
        db.transaction((tx)=>{
            tx.executeSql('INSERT into Auth1(token,userId) VALUES(?,?)',
            [token,userId],
            ()=>{
                resolve()
            },
            (_,err)=>{
                reject(err)
            })
        })
    })
}
export const getToken=()=>{
    return new Promise((resolve,reject)=>{
        db.transaction((tx)=>{
            tx.executeSql('SELECT * FROM Auth1',
            [],
            (_,result)=>{
                resolve(result)
            },
            (_,err)=>{
                reject(err)
            })
        })
    })
}
export const removeToken=()=>{
    return new Promise((resolve,reject)=>{
        db.transaction((tx)=>{
            tx.executeSql('DELETE FROM Auth1',
            ()=>{
                resolve()
            },
            (_,err)=>{
                reject(err)
            })
        })
    })
}