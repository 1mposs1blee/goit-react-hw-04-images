import { useAppState } from 'hooks/use-app-state';
import { useEffect } from 'react';
import { fetchImages } from 'services/pixabay-api';
import { SearchBar } from 'components/Searchbar';
import { ImageGallery } from 'components/ImageGallery';
import { Button } from 'components/Button';
import { Loader } from 'components/Loader';
import { Wrapper } from './App.styled';

export const App = () => {
  const {
    searchQuery,
    setSearchQuery,
    result,
    setResult,
    page,
    setPage,
    per_page,
    totalPage,
    setTotalPage,
    isLoading,
    setIsLoading,
    openModals,
    setOpenModals,
    resetState,
  } = useAppState();

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const data = await fetchImages(searchQuery, page);

        if (data.hits.length === 0) {
          setIsLoading(false);

          setTimeout(() => {
            alert('No images found for the given search query.');
          }, 50);

          return;
        }

        setResult(prevResult => [...prevResult, ...data.hits]);
        setTotalPage(Math.ceil(data.totalHits / per_page));
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, page, per_page, setIsLoading, setResult, setTotalPage]);

  const handleFormSubmit = newSearchQuery => {
    if (newSearchQuery === searchQuery) {
      alert('You wrote the same search query.');

      return;
    }

    resetState();

    setSearchQuery(newSearchQuery);
  };

  const onClickLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleImageClick = id => {
    setOpenModals(prevOpenModals => ({
      ...prevOpenModals,
      [id]: !prevOpenModals[id],
    }));
  };

  return (
    <Wrapper>
      <SearchBar onSubmit={handleFormSubmit} />

      {result.length > 0 && (
        <ImageGallery
          images={result}
          onLargeImageToggle={handleImageClick}
          openModals={openModals}
        />
      )}

      {isLoading ? (
        <Loader />
      ) : (
        page < totalPage && <Button onClickButton={onClickLoadMore} />
      )}
    </Wrapper>
  );
};
