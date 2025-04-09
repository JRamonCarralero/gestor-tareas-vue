<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="main-header">
    <h1>Project Tool</h1>
        <nav class="navbar">
            <ul>
                <li><RouterLink to="/">Inicio</RouterLink></li>
                <li><RouterLink to="/users">Usuarios</RouterLink></li>
                <li><RouterLink to="/tareas">Tareas</RouterLink></li>
            </ul>
        </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>

.main-header {
    width: 100%;
    height: 125px;
    background: #000777;
    border-bottom: 2px solid #000444;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: fixed;
    top: 0;
    z-index: 30;

    h1 {
        text-align: center;
        font-size: 36px;
        color: white;
        margin-bottom: 20px;
    }
}

.navbar {
    width: 100%;

    ul {
        list-style-type: none;
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        text-align: center;

        li {
            flex-grow: 1;

            a {
                display: block;
                color: white;
                text-decoration: none;
                text-shadow: 2px 1px black;
                line-height: 2.5em;
                font-size: 1.3em;

                &:hover {
                    cursor: pointer;
                    background-color: #0011ff;
                }
            }

        }
    }
}

main {
  width: 100%;
  margin-top: 130px;
}
</style>
