package main

import "fmt"

func Hello() string {
	return "Hello, world!"
}

func main() {<% if (wagi) { %>
	fmt.Println("Content-Type: text/plain")
	fmt.Println("")<% } %>
	fmt.Println(Hello())
}
