fn main() {<% if (wagi) { %>
  println!("Content-Type: text/plain\n");<% } %>
  println!("Hello, world!");
}
