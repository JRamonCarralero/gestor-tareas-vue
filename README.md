# Proyect tool

Gestor de proyectos.

Creación, actualización y borrado de usuario tanto en Firebase como en MongoDB.

Login y logout creado, con flag de isAuthenticated en el sessionStorage y gestión del usuario logueado en Pinia.

Añadida seguridad al CRUD de usuarios

* Front end: comprobando que haya usuario conectado y su perfil
* Back end: middleware que comprueba la autenticidad del usuario por medio de un token obtenido de firebase, y comprobado su perfil en MongoDB

CRUD de Proyectos creado. Añadida seguridad:

* Front end: comprobando que haya usuario conectado y su perfil
* Back end: middleware que comprueba la autenticidad del usuario por medio de un token obtenido de firebase, y comprobado su perfil en MongoDB

## ToDo

Tareas:
CRUD de tareas para proyectos. Gestionadas por el creador del proyecto o personas asignadas al proyecto con perfil administrador o permiso para ello (dar una vuelta)

Dashboard:
Para los usuarios normales (técnicos) un dashboard con los proyectos que tiene asignados, y las tareas que tiene que hacer de cada uno. Cambiar estado de tareas.

Diagrama de gannt:
Buscar librerias para crear estos diagramas para ver los distintos proyectos
