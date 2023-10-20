---
title: Just enough Java for Crafting Interpreters
---

I've been working my way through Robert Nystrom's [Crafting Interpreters](https://craftinginterpreters.com/) and had to learn *some* Java in order to run
the `Scanner` class implemented in Chapter 4.

The last time [I wrote Java](https://gist.github.com/jshawl/127cf26be3fe2357342110df9b49dd60)
was right before I withdrew from my first CS 101 course, so I had to put
some time into mastering the basics. This post documents a handful of the
things I had to learn to start scanning tokens in Lox!

Here's a link to an example that will have you up and running with Java
in no time! https://github.com/jshawl/just-enough-java-for-crafting-interpreters

## Installing the JDK

The last time I tried installing the JDK on a mac, I was prompted to create
an account with Oracle, which I did not want to do. I decided to go with
`docker compose` for all of my Java work. The `compose.yml` file looks like:

```yml
services:
  java:
    image: eclipse-temurin:17
```

Starting the `java` service with `docker compose run java bash` will open
a shell where you can then run `javac` to compile your code and `java` to
run it.

## Creating a first Java class

I created my first class inside of `com/jshawl/example` so that the package
name `com.jshawl.example` matched the directory structure. More on packages
in a minute...

Your directory structure should look like this:

```text
./
├── com/
│   └── jshawl/
│       └── example/
│           └── FirstClass.java
└── compose.yml
```

and inside of `FirstClass.java`:

```java
package com.jshawl.example;

class FirstClass {

  public static void main(String[] args) {
    System.out.println("Hello from FirstClass!");
  }
}
```

## Compiling and Running

Let's modify the `compose.yml` to specify a volume for the newly
created `com/` directory:

```diff
 services:
   java:
     image: eclipse-temurin:17
+    working_dir: /app
+    volumes:
+      - ./com:/app/com
```

Start the container:

```bash
docker compose run java bash
```

Compile the code:

```bash
javac com/jshawl/example/FirstClass.java
```

This will create a new file `com/jshawl/example/FirstClass.class`.

You can now run this code with:

```bash
java com.jshawl.example.FirstClass
#=> Hello from FirstClass!
```

## Packages

Packages allow us to group related classes and use a namespace to import
classes from the standard library à la `import java.io.BufferedReader`.

For the examples in Crafting Interpreters, several classes reference
each other, and a shared package allows us to include code without a
specific `import` statement.

Let's create a second class to demo this functionality:

```java
// in com/jshawl/example/SecondClass.java
package com.jshawl.example;

class SecondClass {

  public static void greetings() {
    System.out.println("Greetings from SecondClass.");
  }
}
```

and create an instance of this class inside of `FirstClass.java`:

```diff
  public static void main(String[] args) {
    System.out.println("Hello from FirstClass!");
+   SecondClass secondClass = new SecondClass();
+   secondClass.greetings();
```

you can now recompile:

```bash
javac com/jshawl/example/FirstClass.java
```

and run and you'll see the output from `SecondClass`:

```bash
java com.jshawl.example.FirstClass
#=> Hello from FirstClass!
#=> Greetings from SecondClass.
```

You might have noticed I didn't explicitly compile `SecondClass`. `javac`
is smart enough to compile the code that is referenced in `FirstClass`.

If you wanted to compile everything even if it isn't used anywhere yet,
use a glob:

```bash
javac com/jshawl/example/*.java
```

I'll plan to come back and add to this guide if I encounter any other
foundational knowledge about building and running Java programs, but so
far this was enough for me to start a jlox prompt.

Happy hacking!
