const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy, sortBy, onSetSortBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const [sortByToEdit, setSortByToEdit] = useState(sortBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    useEffect(() => {
        onSetSortBy(sortByToEdit)
    }, [sortByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function handelSortChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'checkbox':
                if (target.checked) value = -1
                else value = 1
                break

            default:
                break
        }
        setSortByToEdit(prevSort => ({ ...prevSort, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    const { txt, minSeverity } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">Text: </label>
                <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />

                <label htmlFor="minSeverity">Min Severity: </label>
                <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />
            </form>

            <form >
                <label htmlFor="sort">Sort by:</label>
                <select onChange={handelSortChange} name="sortField">
                    <option value="severity">Severity</option>
                    <option value="title">Title</option>
                    <option value="createdAt">Creation time</option>
                </select>
                <label htmlFor="sortDir">desending</label>
                <input type="checkbox" name="sortDir" value={-1} onChange={handelSortChange} />
            </form>
        </section>
    )
}