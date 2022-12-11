const STORAGE_KEY = 'unlocked.v1'
const unlocked = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
unlocked[1] = true

function update_unlocked(idx) {
    unlocked[idx] = true
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked))
}

function reset() {
    localStorage.setItem(STORAGE_KEY, '{}')
}

function* get_puzzles()
{
    let index = 1
    const data = puzzles.split('\n')

    let state = 'none'

    for (const line of data)
    {
        if (state == 'none')
        {
            const match = line.match(/[1-9\-]{3,}/)

            if (match === null)
                continue

            state = {
                'size': match[0].length,
                'answer': match[0],
                'puzzle': [],
                'index': index++
            }
        }
        else
        {
            const line2 = line.split('')

            while (line2.length < state.size)
                line2.push(' ')

            state.puzzle.push(line2)

            if (state.puzzle.length == state.size)
            {
                yield state
                state = 'none'
            }
        }
    }
}

function create_puzzle(puzzle)
{
    const section = document.createElement('section')
    section.classList.add('puzzle')
    section.dataset.puzzleIndex = puzzle.index
    if (unlocked[puzzle.index] !== true)
        section.classList.add('hidden')

    const question = document.createElement('section')
    question.classList.add('question')
    question.dataset.answer = puzzle.answer
    question.dataset.size = puzzle.size
    question.style.cssText += `--puzzle-size: ${puzzle.size};`
    
    for (let y = -1; y <= puzzle.size; ++y)
    {
        for (let x = -1; x <= puzzle.size; ++x)
        {
            const item = document.createElement('div')
            item.classList.toggle('left', x == -1)
            item.classList.toggle('right', x == puzzle.size)
            item.classList.toggle('top', y == -1)
            item.classList.toggle('bottom', y == puzzle.size)

            if (item.classList.length == 0)
                item.dataset.value = puzzle.puzzle[y][x]

            question.append(item)
        }
    }

    for (let y = -1; y <= 1; ++y)
    {
        for (let x = -1; x <= puzzle.size; ++x)
        {
            const item = document.createElement('div')
            item.dataset.index = x + 1
            item.classList.toggle('left', x == -1)
            item.classList.toggle('right', x == puzzle.size)
            item.classList.toggle('top', y == -1)
            item.classList.toggle('bottom', y == 1)

            if (item.classList.length == 0)
            {
                item.dataset.click = 'empty'

                item.addEventListener('click', function() {
                    if (item.dataset.click == 'clicked')
                        return

                    if (item.dataset.click == 'wrong')
                    {
                        question.dataset.current_answer = ''

                        question.querySelectorAll('[data-click]').forEach(e => {
                            e.dataset.click = 'empty'
                            e.innerText = ''
                        })
                    }

                    let current_answer = question.dataset.current_answer || ''
                    item.dataset.click = 'clicked'
                    current_answer += `${item.dataset.index}`
                    item.innerText = `${current_answer.length}`
                    question.dataset.current_answer = current_answer

                    if (current_answer.length == puzzle.size)
                    {
                        if (current_answer == question.dataset.answer)
                        {
                            const next_puzzle = document.querySelector(`[data-puzzle-index="${puzzle.index+1}"]`)

                            if (next_puzzle == null)
                                return

                            update_unlocked(puzzle.index+1)
                            next_puzzle.classList.remove('hidden')
                            const margin = (window.innerHeight - next_puzzle.clientHeight) / 2
                            window.scrollTo({
                                top: next_puzzle.offsetTop - margin,
                                behavior: 'smooth'
                            })
                        }
                        else
                        {
                            question.querySelectorAll('[data-click]').forEach(e => {
                                e.dataset.click = 'wrong'
                            })
                        }
                    }
                })
            }


            question.append(item)
        }
    }
    
    section.append(question)
    return section
}

for (const puzzle of get_puzzles())
{
    const item = create_puzzle(puzzle)
    document.body.append(item)
}

let frame = 0
setInterval(function() {
    frame = (frame + 1) % 16
    document.body.dataset.frame = frame
}, 50)