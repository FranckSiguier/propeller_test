## If you want to launch the tests

jest

## Propeller Aero test

cd propeller

## Build the docker image

docker build . -t propeller/image-processor

## Run the container

docker run -p 3000:3000 -d propeller/image-processor

## Send an image to process

Do a post request to http://localhost:3000/upload with the following JSON

{
"imageAddress": "your image address",
"folder": "the folder in the uploads folder you want the tiles to go in"
}

## Get a bash terminal in your container

docker exec -it $CONTAINER_ID bash
cd uploads
ls

Your should see all the tiles of the image from the URL you sent
