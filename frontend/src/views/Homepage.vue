<template>
  <div class="homepage">
    <div class="button">
      <router-link
        tag="div"
        :to="{ name: 'createBlog' }"
      >
        STWÓRZ BLOGA
      </router-link>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Homepage',
  data () {
    return {
      modules: []
    }
  },
  async mounted () {
  }
}
</script>

<style lang="scss">
.homepage {
  text-align: center;
  font-family: "Kalam", sans-serif;

  #logo {
    padding: 10px 0;
    box-shadow: 3px 3px 30px 5px #00193135;
    font-size: 64px;
    margin-bottom: 35px;
    margin-top: 12.39%;
    color: #fff;
    background: #fff1;
    text-shadow: 2px 2px 1px #000;

    @media (max-width: 640px) {
      font-size: 43px;
    }

    @media (max-width: 420px) {
      font-size: 33px;
    }
  }

  .top-content {
    background-image: url('/static/party_img1.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    overflow: auto;
    display: flex;
    flex-direction: column;
    height: 77vw;
    min-height: 280px;
    max-height: 77vh;
  }

  .about_site {
    margin: 30px auto;
    margin-top: -15px;
    padding: 20px 0;
    width: 80%;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(25, 25, 25, 0.2);

    p {
      margin: 0;
      padding: 35px;
      font-size: 28px;

      @media (max-width: 420px) {
        font-size: 18px;
      }
    }

    h2 {
      margin: 0 auto;
      width: 80%;
      color: #686668;
      text-align: justify;

      @media (max-width: 420px) {
        font-size: 12px;
      }
    }
  }

  .modules {
    width: 80%;
    font-size: 18px;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;

    .module_about {
      margin: 10px;
      width: 320px;

      @media (max-width: 2109px) {
        width: 250px;
      }

      @media (max-width: 1688px) {
        width: 350px;
      }

      img {
        width: 100%;
      }

      p {
        padding: 0;
        margin: 0;
      }

      span {
        text-justify: auto;
      }
    }
  }

  .button {
    margin: 15px auto;
    box-shadow: 0 0 30px 5px #0004;
    padding: 10px;
    background-color: black;
    border-radius: 4px;
    color: white;
    width: 250px;
    font-size: 18px;

    &:hover {
      cursor: pointer;
    }

    @media (max-width: 420px) {
      width: 150px;
      font-size: 12px;
    }
  }
}
</style>
