mkdir ~/setup
mkdir ~/python_packages
cd ~/setup
apt-get source python-setuptools
cd ~/setup/distribute-0.6.24

export PYTHONPATH=$PYTHONPATH:~/python_packages
echo 'export PYTHONPATH=$PYTHONPATH:~/python_packages' >> ~/.bash_profile
python easy_install.py --install-dir ~/python_packages flask
python easy_install.py --install-dir ~/python_packages redis
