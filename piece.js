class Piece { //for a single fallen piece
    constructor(design, ctx) {
        this.design = design 
        this.ctx = ctx 
        this.y = 0 
        this.x = Math.floor(COLS / 2) //middle
    }

    renderPiece() {
        this.design.map((row, i) => {
            row.map((cell, j) => {
                if (cell > 0) {
                    this.ctx.fillStyle = COLORS[cell] 
                    this.ctx.fillRect(this.x + j, this.y + i, 1, 1)
                }
            })
        })
    }
}