
- The **`venv`** folder is used to create a virtual environment in Python, which is an isolated environment that allows you to manage dependencies for your project without affecting the global Python installation. This ensures that each project can have its own set of dependencies.
    
    After cloning the repository, the virtual environment folder must be created to install the backend dependencies.
    
    1. create a virtual environment
        
        ```bash
        cd back-end
        python -m venv venv
        ```
        
    2. activate the virtual environment (in cmd and not powershell)
        
        ```bash
        venv\Scripts\activate
        ```
        
    3. install the dependencies
        
        ```bash
        pip install -r requirements.txt
        ```
        
- After setting up the **`venv`** folder, create a MySQL database with the name poste-maroc, then run migrations
    
    ```bash
    cd core
    py manage.py migrate
    ```
    
- Next, run the following commands to populate the database
    ```bash
    py manage.py shell
    ```
    enter this command:
    ```bash
    exec(open('core/seeders.py').read())
    ```

- Finally, you can run your backend project server
    
    ```bash
    py manage.py runserver
    ```

