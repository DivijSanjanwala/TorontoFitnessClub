virtualenv env
source ./env/bin/activate
pip install -r requirements.txt
python3 manage.py makemigrations accounts
python3 manage.py makemigrations studios
python3 manage.py makemigrations subscriptions
python3 manage.py makemigrations
python3 manage.py migrate accounts
python3 manage.py migrate studios
python3 manage.py migrate subscriptions
python3 manage.py migrate
npm install --prefix ../project-frontend
npm run start --prefix ../project-frontend