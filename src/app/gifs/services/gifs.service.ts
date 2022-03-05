import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private api_key = 'GZ6h2UWaDFyK1KrdpSXAfXohs9f8ZiJ7';
  private servicioUrl = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial(){
    return [...this._historial];
  }

  constructor(private http:HttpClient){
    this._historial = JSON.parse(localStorage.getItem('historial')! ) || [];
    this.resultados = JSON.parse(localStorage.getItem('lastSearch')! ) || [];
  }

  buscarGifs(query:string=''){

    query = query.trim().toLowerCase();

    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);


      localStorage.setItem('historial',JSON.stringify(this._historial));

    }

    const params = new HttpParams()
                        .set('api_key', this.api_key )
                        .set('limit', '10' )
                        .set('q', query );

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`,{params})
    .subscribe( (resp) => {
      // console.log(resp.data);
      this.resultados= resp.data;
      localStorage.setItem('lastSearch',JSON.stringify(this.resultados));
    })
    // console.log(this._historial);
  }
}
