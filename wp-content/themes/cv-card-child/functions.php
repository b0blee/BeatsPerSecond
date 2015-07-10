<?php 

add_action( 'wp_enqueue_scripts', 'theme_enqueue_styles' );

function theme_enqueue_styles() {
  wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );

}

add_action( 'wp_enqueue_scripts', 'child_add_scripts' );

function child_add_scripts() {
  if (is_page('bps')) {
    wp_register_script('bps-script','/bps.js');
    wp_enqueue_script( 'bps-script' );
  }
}



