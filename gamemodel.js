class GameModel {
    constructor(ctx) {
        this.ctx = ctx  //contex object
        this.falling = null // piece
        this.grid = this.makeStartingGrid()
    }

    makeStartingGrid() {
        let grid = [] 
        for (var i = 0; i < ROWS; i++) {
            grid.push([])
            for (var j = 0; j < COLS; j++) {
                grid[grid.length - 1].push(0)
            }
        }
        return grid 
    }

    collision(x, y, candidate=null) {
        const design = candidate || this.falling.design 
        const n = design.length 
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (design[i][j] > 0) {
                    let p = x + j 
                    let q = y + i  
                    if (p >= 0 && p < COLS && q < ROWS) {
                        // in bounds

                        if (this.grid[q][p] > 0) {
                            return true
                        }
                    } else {
                        return true
                    }
                }
            }
        }
        return false
    }

    renderGameState() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                let cell = this.grid[i][j] 
                this.ctx.fillStyle = COLORS[cell] 
                this.ctx.fillRect(j, i, 1, 1)
            }
        }

        if (this.falling !== null) {
            this.falling.renderPiece()
        }
    }


    moveDown() {
        if (this.falling === null) {
            this.renderGameState() //no keys to move down
            return
        } else if (this.collision(this.falling.x, this.falling.y + 1)) {
            const design = this.falling.design 
            const x = this.falling.x 
            const y = this.falling.y 
            design.map((row, i) => {
                row.map((cell, j) => {
                    let p = x + j 
                    let q = y + i 
                    if (p >= 0 && p < COLS && q < ROWS && cell > 0) {
                        this.grid[q][p] = design[i][j]
                    }
                })
            })

            // check game over 
            if (this.falling.y === 0) {
                alert("Game over!") 
                this.grid = this.makeStartingGrid() //reset the grid
            }
            this.falling = null
        } else {
            this.falling.y += 1
        }
        this.renderGameState()
    }

    move(right) {
        if (this.falling === null) {
            return
        }

        let x = this.falling.x 
        let y = this.falling.y 
        if (right) {
            // move right
            if (!this.collision(x + 1, y)) {
                this.falling.x += 1
            }
        } else {
            // move left
            if (!this.collision(x - 1, y)) {
                this.falling.x -= 1
            }
        }
        this.renderGameState()
    }

    rotate() {
        if (this.falling !== null) {
            let design = [...this.falling.design.map((row) => [...row])]
            // transpose of matrix 
            for (let y = 0; y < design.length; ++y) {
                for (let x = 0; x < y; ++x) {
                    [design[x][y], design[y][x]] = 
                    [design[y][x], design[x][y]]
                }
            }
            // reverse order of rows 
            design.forEach((row => row.reverse()))
            if (!this.collision(this.falling.x, this.falling.y, design)) {
                this.falling.design = design
            }
        }
        this.renderGameState()
    }
}