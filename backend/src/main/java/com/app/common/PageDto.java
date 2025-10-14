package com.app.common;
import java.util.List;

public class PageDto<T> {
  public List<T> items;
  public int page;
  public int size;
  public long totalItems;
  public int totalPages;
  public String sort;

  public PageDto(List<T> items, int page, int size, long totalItems, int totalPages, String sort){
    this.items = items;
    this.page = page;
    this.size = size;
    this.totalItems = totalItems;
    this.totalPages = totalPages;
    this.sort = sort;
  }
}
