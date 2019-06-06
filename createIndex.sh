#/bin/sh
echo  -e "Indique el nombre del test para el cual se va a crear el índice \n"
read answer
cd v1
TEST=${answer} node createIndex.js
echo  -e "Indice creado\n"