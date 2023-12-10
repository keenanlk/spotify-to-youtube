package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// getAlbums responds with the list of all albums as JSON.
func helloWorld(c *gin.Context) {
	// return string Hello World
	c.JSON(http.StatusOK, gin.H{
		"message": "Hello World!",
	})
}

func main() {
	router := gin.Default()
	router.GET("/", helloWorld)

	router.Run("localhost:8080")
}
