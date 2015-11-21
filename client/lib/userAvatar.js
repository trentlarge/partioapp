userAvatar = function(data){
  if(data === 'notSet') {
    return "/profile_image_placeholder.jpg"
  } else {
    return data;
  }
}
