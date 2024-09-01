let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")
let width = canvas.width
let height = canvas.height
let meshSize = 10
let widthInMesh = width / meshSize
let heightInMesh = height / meshSize
let score = 0
let directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
}

const random = () => {
    return Math.floor(Math.random() * (widthInMesh - 2)) + 1
}

const circle = (x,y,radius,fillCircle) => {
    ctx.beginPath()
    ctx.arc(x,y,radius,0,Math.PI*2,false)
    if(fillCircle)
        ctx.fill()
    else
        ctx.stroke()
}

const drawBorder = () => {
    ctx.fillStyle = "olive"
    ctx.fillRect(0,0,width,meshSize)
    ctx.fillRect(0,0,meshSize,height)
    ctx.fillRect(width - meshSize,0,meshSize,height)
    ctx.fillRect(0,height - meshSize,width,meshSize)
}

const drawScore = (index) => {
    ctx.fillStyle = "olive"
    ctx.font = "25px Courier"
    ctx.textAlign = "left"
    ctx.textBaseline = "top"
    ctx.fillText("Score:" + index,meshSize,meshSize)
}

const gameOver = () => {
    clearInterval(gameStart)
    ctx.font = "60px Arial"
    ctx.fillStyle = "Red"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("GameOver!",width/2,height/2)
    setTimeout(function ()
    {
        location.reload()
    },2000)
}

class MeshPosition {
    constructor(col,row) {
        this.col = col
        this.row = row
    }

    drawSquare(color) {
        let x = this.col * meshSize
        let y = this.row * meshSize
        ctx.fillStyle = color
        ctx.fillRect(x,y,meshSize,meshSize)
    }

    drawCircle(color) {
        let cX = this.col *meshSize + meshSize/2
        let cY = this.row *meshSize + meshSize/2
        ctx.fillStyle = color
        circle(cX,cY,meshSize/2,true)
    }

    equalPos(obj) {
        return this.col === obj.col && this.row === obj.row
    }
}

class Snake {
    constructor(snakeTail = [new MeshPosition(7,5),new MeshPosition(6,5),new MeshPosition(5,5)],currentDirection = "right",nextDirection = "right") {
        this.snakeTail = snakeTail
        this.currentDirection = currentDirection
        this.nextDirection = nextDirection
    }

    draw() {
        for(let i =0;i<this.snakeTail.length;i++)
        {
            this.snakeTail[i].drawSquare("Blue")
        }
    }

    testCollision(snakeHead) {
        let leftCol = (snakeHead.col === 0)
        let topCol = (snakeHead.row ===0)
        let rightCol = (snakeHead.col === widthInMesh-1)
        let bottomCol = (snakeHead.row === heightInMesh-1)
        let borderCol = leftCol || topCol || rightCol || bottomCol
        let selfCol = false
        for(let i = 0;i<this.snakeTail.length;i++)
        {
            if(snakeHead.equalPos(this.snakeTail[i]))
                selfCol = true;
        }
        return borderCol || selfCol
    }

    setDirections(newDirection){
        if(this.currentDirection === "right" && this.nextDirection === "left")
        {
            return
        }
        else if (this.currentDirection === "left" && this.nextDirection === "right")
        {
            return
        }
        else if (this.currentDirection === "up" && this.nextDirection === "down")
        {
            return
        }
        else if (this.currentDirection === "down" && this.nextDirection === "up")
        {
            return
        }

        this.nextDirection = newDirection
    }

    move() {
        let curHead = this.snakeTail[0]
        let nextHead
        this.currentDirection = this.nextDirection
        if (this.currentDirection === "right")
        {
            nextHead = new MeshPosition(curHead.col + 1,curHead.row)
        }
        else if (this.currentDirection === "down")
        {
            nextHead = new MeshPosition(curHead.col,curHead.row + 1)
        }
        else if (this.currentDirection === "left")
        {
            nextHead = new MeshPosition(curHead.col - 1,curHead.row)
        }
        else if (this.currentDirection === "up")
        {
            nextHead = new MeshPosition(curHead.col,curHead.row - 1)
        }
        if (this.testCollision(nextHead))
        {
            gameOver()
            return
        }
        this.snakeTail.unshift(nextHead)

        if(nextHead.equalPos(apple.position))
        {
            score++
            apple.move()
        }
        else
        {
        this.snakeTail.pop()
        }

    }
}

class Apple {
    constructor(position = new MeshPosition(10,10)) {
        this.position = position
    }
    draw() {
        this.position.drawCircle("Red")
    }
    move() {
        this.position = new MeshPosition(random(),random())
    }
}

let snake = new Snake()
let apple = new Apple()


let check = confirm("Press OK to start the game")

if(check)
{
    var gameStart = setInterval(function () {
        ctx.clearRect(0,0,width,height)
        drawBorder()
        drawScore(score)
        snake.move()
        snake.draw()
        apple.draw()
    },100)
}

document.addEventListener('keydown', function (event){
    let newDirection = directions[event.which]
    if(newDirection !== undefined )
    {
        snake.setDirections(newDirection)
    }
})
