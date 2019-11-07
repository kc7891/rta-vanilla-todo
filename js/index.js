class Todo {
    // [{id: string, value: string}]
    todos = []
    nextId = 0
    idPrefix = 'id_'
    localStorageKey = 'todos'

    constructor () {
        document.querySelector('#add').addEventListener('click',this.addHandler)

        // fetch localstorage data
        const localStorageData = localStorage.getItem(this.localStorageKey)
        this.todos = localStorageData ? JSON.parse(localStorageData) : []

        this.firstRender()

        this.initNextId()
    }

    getId = () => {
        return this.nextId++
    }

    initNextId = () => {
        if (this.todos.length < 0 ) return
        let lastId = this.todos.reduce((previousValue,{id}) => {
            const currentId = id.replace(this.idPrefix,'')
            return previousValue < currentId ? currentId : previousValue
        },0)
        this.nextId = ++lastId
    }

    firstRender = () => {
        this.todos.map(({id,value})=> {
            this.addNewLiNode(id, value)
        })
    }

    submit = () => {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.todos));
    }

    detectClickedId = (clickedElement) => {
        return clickedElement.parentElement.id
    }

    addNewLiNode = ( id, value ) => {
        const liNode = document.createElement('li')
        liNode.id = id

        const input = document.createElement('input')
        input.type = 'text'
        input.value = value
        input.addEventListener('blur',this.saveHandler)

        const deleteButton = document.createElement('button')
        deleteButton.className = 'delete'
        deleteButton.innerText = 'delete'
        deleteButton.addEventListener('click',this.deleteHandler)

        liNode.appendChild(input)
        liNode.appendChild(deleteButton)

        document.querySelector('#todos').appendChild(liNode)
    }

    addHandler = () => {
        const newId = `${this.idPrefix}${this.getId()}`
        this.todos.push({
            id:newId,
            value: ''
        })
        this.addNewLiNode( newId , '')
        this.submit()
    }

    saveHandler = (e) => {
        const clickedId = this.detectClickedId(e.currentTarget)
        const inputValue = document.querySelector(`#${clickedId}`).firstChild.value
        const updateIndex = this.todos.findIndex(({id}) => {
            return id === clickedId
        })
        this.todos[updateIndex].value = inputValue
        this.submit()
    }

    deleteHandler = (e) => {
        const clickedId = this.detectClickedId(e.currentTarget)
        const delIndex = this.todos.findIndex(({id}) => {
            return id === clickedId
        })
        this.todos.splice(delIndex,1)
        document.querySelector(`#${clickedId}`).remove()
        this.submit()
    }
}

window.onload = () => {
    new Todo()
}