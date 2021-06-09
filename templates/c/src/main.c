#include <stdio.h>

int main() {<% if (wagi) { %>
  printf("Content-Type: text/plain\n\n");<% } %>
  printf("Hello, world!\n");
  return 0;
}
